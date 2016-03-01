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
                                outFile.write(otherFile.read())
                        else:
                            raise Exception(page + ' had an unknown ' +
                                include[1] + ' include type.')
                    else:
                        outFile.write(line)

    # Create webpages for all .txt posts. What is whitespace who cares.
    # First line in .txt is title, second line in .txt is time
    for post in posts:
        with open(folder + post, 'r') as inFile:
            name = post.split('.')[0] + '.html'
            with open(name, 'w') as outFile:
                # Write the header stuff
                # Specifically prepend ../ to all relative links
                outFile.write('<!doctype html><html lang="en"><head> \
                    <meta charset="UTF-8"><meta content="IE=edge" \
                   http-equiv="X-UA-Compatible"><meta name="viewport" \
                  content="width=device-width, initial-scale=1"> \
                 <title>Eugene Y. Q. Shen</title><link rel="stylesheet" \
                href="../css/bootstrap.min.css"></head><body> \
               <nav role="navigation"><ul class="nav nav-tabs nav-justified"> \
              <li role="presentation"><a href="../index.html">Index</a></li> \
             <li role="presentation"><a href="../about.html">About</a></li> \
            <li role="presentation"><a href="../blog.html">Blog</a></li> \
           <li role="presentation"><a href="../cakes.html">Cakes</a></li> \
          <li role="presentation"><a href="../documents.html">Documents</a> \
         </li><li role="presentation"><a href="../projects.html">Projects</a> \
        </li><li role="presentation"><a href="../questions.html">Questions</a>\
       </li><li role="presentation"><a href="../resume.html">Resume</a></li> \
      <li role="presentation"><a href="../sitemap.html">Sitemap</a></li></ul> \
     </nav><div class="container"><section role="main" class="col-xs-12">')
                # Write the title and time
                outFile.write('<h1>' + inFile.readline().strip() + '</h1>')
                outFile.write(
                    '<h3><time>' + inFile.readline().strip() + '</time></h3>')
                # Write the actual blog content, surrounded by p tags
                for line in inFile:
                    lines = line.strip()
                    if lines.startswith('[') and lines.endswith(']'):
                        outFile.write('<img src="../imgs/' + lines[1:-1] +
                                      '.png" height="528" width="959" />')
                    elif '<!--#end head-->' not in lines:
                        outFile.write('<p>' + lines + '</p>')
                # Write the footer stuff
                outFile.write('</section>')
                with open(folder + 'footer.shtml') as otherFile:
                    outFile.write(otherFile.read())

            # Write the head to the main blog page
            inFile.seek(0)
            with open(folder + 'blog.html', 'w') as outFile:
                with open(folder + 'header.shtml') as otherFile:
                    outFile.write(otherFile.read())
                outFile.write('<body>')
                with open(folder + 'nav.shtml') as otherFile:
                    outFile.write(otherFile.read())
                outFile.write('<div class="container"><section role="main" \
                               class="col-xs-12"><h1>Blog</h1>')
                outFile.write('<h3>' + inFile.readline().strip() + '</h3>')
                outFile.write('<time>' + inFile.readline().strip() + '</time>')
                for line in inFile:
                    if '<!--#end head-->' in line:
                        break
                    outFile.write('<p>' + line.strip() + '</p>')
                outFile.write('<p><a href="' + name + '">Continue reading » \
                               </a></p></section>')
                with open(folder + 'footer.shtml') as otherFile:
                    outFile.write(otherFile.read())

except:
    print('Site not made, aborting.')
    cleanup()
    raise

print('Site successfully made.')
