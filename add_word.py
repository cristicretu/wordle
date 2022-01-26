import sys

word = sys.argv[1]
author = sys.argv[2]

if word == "":
		print("Error: No word provided")
		sys.exit(1)

if author == "":
		print("Error: No author provided")
		sys.exit(1)

if author != 'cristicretu' and author != 'mircea1711' and author != 'patriimanciu':
		sys.exit(1)


rest_of_the_line = ''

with open('index.js', 'r') as f:
	rest_of_the_line += f.read()

rest_of_the_line = ''.join(rest_of_the_line.splitlines(keepends=True)[2:])


word = "'" + word + "',"

file = "'use strict'\n\nconst words = [\n  " + word +'\n' + rest_of_the_line

with open('index.js', "w") as myfile:
    myfile.write(file)