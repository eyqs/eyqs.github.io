#!/usr/bin/env python
# Make my web site!
import os
import re
import sys

folder = 'site/'
files = os.listdir(folder)
pages = []
posts = []
subfolders = []

# Remove created webpages
def cleanup():
    for page in pages:
        try:
            os.remove(page)
        except:
            pass
    for post in posts:
        try:
            name = post.split('.')[0] + '.html'
            os.remove(name)
        except:
            pass
    for sub in subfolders:
        try:
            os.rmdir(sub)
        except:
            pass

print('Making site...')
# Add all webpages to be created
# Ensure that there is only one level of subfolders
for item in files:
    if any([x in item for x in ['swp', 'shtml']]):
        continue    # Ignore all of these files
    elif 'html' in item:
        pages.append(item)
    else:           # Must be a subfolder then
        subfolders.append(item)
for sub in subfolders:
    for post in os.listdir(folder + sub):
        if any([x in post for x in ['swp', 'png']]):
            continue    # Ignore all of these files
        if 'txt' in post:
            posts.append(sub + '/' + post)
        else:
            pages.append(sub + '/' + post)

cleanup()                   # Delete previously-created subfolders
if 'clean' in sys.argv:     # Exit if goal was to remove everything
    print('All webpages successfully removed.')
    sys.exit()
for sub in subfolders:      # Otherwise, continue and make subfolders
    os.mkdir(sub)

try:
    # Create all webpages to be created
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

    # Create webpages for all .txt posts
    # First line is title, second line is date
    for post in posts:
        with open(folder + post, 'r') as inFile:
            name = post.split('.')[0] + '.html'
            with open(name, 'w') as outFile:
                outFile.write('<h2>' + inFile.readline().strip() + '</h1>\n')
                outFile.write('<h3><date>' + inFile.readline().strip() + '</date></h3>\n')
                for line in inFile:
                    outFile.write('<p>' + line.strip() + '</p>\n')

except:
    print('Site not made, aborting.')
    cleanup()
    raise

print('Site successfully made.')
