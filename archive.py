#!/usr/bin/env python
import urllib.request
pages = ['', 'about/', 'blog/', 'cakes/', 'documents/', 'projects/',
         'questions/', 'resume/', 'sitemap/', 'tools/']
posts = ['1804-ubcs-cpen/', '1805-late-rides/', '1806-wtfjs-idkjs/',
         '1807-cloud-next/', '1808-sunny-vale/', '1809-mug-share/',
         '1811-music-18w1/']
if __name__ == '__main__':
    for page in pages:
        print('Archiving page: ' + page)
        urllib.request.urlopen('http://web.archive.org/save/' +
                               'https://eyqs.ca/' + page)
    for post in posts:
        print('Archiving post: ' + post)
        urllib.request.urlopen('http://web.archive.org/save/' +
                               'https://eyqs.ca/blogs/' + post)
