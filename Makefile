build:
	cd data; python data2json.py
	mv data/*.json app/data/


install:
	cd app; npm install

run:
	cd app; gulp

deploy:
	cd app; gulp deploy
