import yaml,pprint

def generateSchema(l):
	target = ""

	lines = []
	lines.append("var mongoose = require('mongoose');\n")
	lines.append("var Schema = mongoose.Schema;\n")
	lines.append("var grantmakerSchema = new Schema({\n")

	for i in l:
		lines.append("\t"+i["field"]+" : "+i["type"]+",\n")

	lines.append("});")
	# target.write(lines)

	fo = open("schema.js", "w")
	fo.writelines( lines )
	fo.close()

lo = []

with open("../_data/grantseeker.yml", 'r') as stream:
    out = yaml.load(stream)

    for sect in out[0]["sections"]:
    	for quest in sect["questions"]:
    		o = {"field": quest['dbfield'], "type": quest['type']}
    		lo.append(o)
    		print o
	    	# print quest['dbfield']

generateSchema(lo)




