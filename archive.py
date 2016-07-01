#!/usr/bin/env python
import urllib.request
pages = ['', 'about/', 'blog/', 'cakes/', 'documents/', 'projects/',
         'questions/', 'resume/', 'sitemap/', 'tools/']
posts = ['1601-first-post/', '1602-dwarf-fort/', '1603-teach-aide/',
         '1604-hard-ware/', '1605-may-exams/', '1606-elap-rules/']
if __name__ == '__main__':
    for page in pages:
        urllib.request.urlopen('http://web.archive.org/save/' +
                               'https://eyqs.ca/' + page)
    for post in posts:
        urllib.request.urlopen('http://web.archive.org/save/' +
                               'https://eyqs.ca/blogs/' + post)
