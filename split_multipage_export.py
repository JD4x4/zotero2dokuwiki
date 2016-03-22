"""Split Multipage Export into individual txt files
Usage:
    split_multipage_export.py <export_filename> <output_dir>
"""
import re
import os
from docopt import docopt

def split_multipage_export(filename, output_dir):
    fp = open(filename, 'r')
    data = fp.readlines()
    zotero_key_pattern = re.compile('\$==(.*)==\$')
    
    zotero_key = None
    output_file = None
    
    for line in data:
        m = zotero_key_pattern.match(line)
        if m:
            zotero_key = m.group()
            zotero_key = zotero_key.replace('$==','')
            zotero_key = zotero_key.replace('==$','')
            zotero_key = zotero_key.lower()
            output_file = open(os.path.join(output_dir,zotero_key + '.txt'),'w')
        else:
            output_file.write(line)

if __name__ == '__main__':
    arguments = docopt(__doc__)

    export_filename = arguments['<export_filename>']
    output_dir = arguments['<output_dir>']

    split_multipage_export(export_filename, output_dir)
