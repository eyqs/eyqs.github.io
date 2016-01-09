#!/usr/bin/env python
folder = 'site/'
files = ['about.html', 'blog.html', 'index.html']

for html in files:
    with open(folder + html, 'r') as inFile:
        with open(html, 'w') as outFile:
            for line in inFile:
                # Format of SSI is <!--#include file="foo.shtml"-->
                if '<!--#include file=' in line:
                    start = line.find('=')
                    end = line.find('.shtml')
                    shtml = line[start+2 : end+6]
                    with open(folder + shtml, 'r') as includeFile:
                        for line in includeFile:
                            outFile.write(line)
                else:
                    outFile.write(line)
