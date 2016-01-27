#!/usr/bin/env python
# Make my web site!
import os
import re
import sys

folder = 'site/'
files = os.listdir(folder)
pages = []
subfolders = []

# Remove created webpages
def cleanup():
    for page in pages:
        try:
            os.remove(page)
        except:
            pass
    for sub in subfolders:
        try:
            os.rmdir(sub)
        except:
            pass

print('Making site...')
# Add all webpages to be created
for item in files:
    if 'html' not in item:
        # Everything ends in .html except for subfolders
        subfolders.append(item)
    elif 'shtml' not in item:
        pages.append(item)
for sub in subfolders:
    pages.extend([sub + '/' + post for post in os.listdir(folder + sub)])

cleanup()                   # Delete previously-created subfolders
if 'clean' in sys.argv:     # Exit if goal was to remove everything
    print('All webpages successfully removed.')
    sys.exit()
for sub in subfolders:      # Otherwise, continue and make subfolders
    os.mkdir(sub)

# Creat all webpages to be created
try:
    for page in pages:
        with open(folder + page, 'r') as inFile:
            with open(page, 'w') as outFile:
                for line in inFile:
                    # Custom format is <!--#include type="foo.shtml"-->
                    if '<!--#include' in line:
                        start = line.find('<')
                        end = line.find('>')
                        include = re.split(' |"', line[start:end])
                        # ['<--#include', 'type=', 'foo.shtml', '--']
                        if include[1] == 'file=':
                            with open(folder + include[2], 'r') as otherFile:
                                for stuff in otherFile:
                                    outFile.write(stuff)
                        elif include[1] == 'head=':
                            with open(folder + include[2], 'r') as otherFile:
                                isHead = False
                                for stuff in otherFile:
                                    if '<!--#end head-->' in stuff:
                                        isHead = False
                                    elif isHead:
                                        outFile.write(stuff)
                                    elif '<!--#start head-->' in stuff:
                                        isHead = True
                        else:
                            raise Exception(page + ' had an unknown ' +
                                include[1] + ' include type.')
                    else:
                        outFile.write(line)

except:
    print('Site not made, aborting.')
    cleanup()
    raise

print('Site successfully made.')
