#!/usr/bin/env python
import urllib.request
pages = ['', 'about/', 'blog/', 'cakes/', 'documents/', 'projects/',
         'questions/', 'resume/', 'sitemap/', 'tools/']
posts = ['1804-ubcs-cpen/', '1805-late-rides/', '1806-wtfjs-idkjs/',
         '1807-cloud-next/']
if __name__ == '__main__':
    for page in pages:
        urllib.request.urlopen('http://web.archive.org/save/' +
                               'https://eyqs.ca/' + page)
    for post in posts:
        urllib.request.urlopen('http://web.archive.org/save/' +
                               'https://eyqs.ca/blogs/' + post)
