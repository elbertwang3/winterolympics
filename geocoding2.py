import googlemaps
import pyodbc
import pandas as pd
import sys
import logging

logger = logging.getLogger("root")
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger.addHandler(ch)

gmaps = googlemaps.Client(key='AIzaSyDVY2gfyRxBceJNN6bFESkKMpqPsRnnhSM')

host = 'demo.drem.io'
port = 31010
uid = 'elbert'
pwd = 'dremio123'
driver = 'Dremio Connector'
output_file_path = 'data/gamesgeocoded2.csv'

cnxn = pyodbc.connect("DRIVER={};ConnectionType=Direct;HOST={};PORT={};AuthenticationType=Plain;UID={};PWD={}".format(driver,host,port,uid,pwd),autocommit=True)

sql = '''SELECT * FROM "@elbert".winterolympicstut.games'''

df = pd.read_sql(sql,cnxn)

for index, row in df.iterrows():
	to_geocode = row['City'] + ", " + row['Country']
	try:
		geocode_result = gmaps.geocode(to_geocode)
		df.at[index, 'latitude'] = (geocode_result[0]['geometry']['location']['lat'])
		df.at[index, 'longitude'] = (geocode_result[0]['geometry']['location']['lng'])
	except Exception as e:
		logger.exception(e)
		logger.error("Skipping!")
	except:
		e = sys.exc_info()
		print e

df.to_csv(output_file_path,index_label="id")
