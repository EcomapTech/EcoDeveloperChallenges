import gzip
import shutil

input_file = '/Users/duncanwood/Desktop/GoogleNews-vectors-negative300.bin.gz'
output_file = '/Users/duncanwood/Desktop/GoogleNews-vectors-negative300.bin'

with gzip.open(input_file, 'rb') as f_in:
    with open(output_file, 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
