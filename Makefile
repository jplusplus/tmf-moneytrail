build:
	cd data; python data2json.py
	mv data/*.json demo1/data/


install:
	cd demo1; npm install

run:
	cd demo1; gulp

deploy:
	cd demo1; gulp deploy
