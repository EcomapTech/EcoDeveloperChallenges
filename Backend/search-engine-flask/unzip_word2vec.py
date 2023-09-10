""" Unzips the GoogleNews word2vec file. """
import gzip
import shutil

INPUT_FILE = '/Users/duncanwood/Desktop/GoogleNews-vectors-negative300.bin.gz'
OUTPUT_FILE = '/Users/duncanwood/Desktop/GoogleNews-vectors-negative300.bin'

with gzip.open(INPUT_FILE, 'rb') as f_in:
    with open(OUTPUT_FILE, 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
