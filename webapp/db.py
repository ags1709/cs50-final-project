from sqlalchemy import create_engine, text
from .config import connection_string

# Create engine that can connec to database
connection_string = connection_string
engine = create_engine(
    connection_string, connect_args={"ssl": {"ssl_ca": "/etc/ssl/cert.pem"}}
)

# Function to select data from database, and return a list of dictionaries
def select_data(query, **kwargs):
    with engine.connect() as con:
        stmt = text(query)
        result = con.execute(stmt, kwargs).all()
        results_list = []
        for row in result:
            results_list.append(row._asdict())
        return results_list

# Function to do other interactions with database, like updating, deleting, inserting etc.
def update_db(query, **kwargs):
    with engine.connect() as con:
        stmt = text(query)
        con.execute(stmt, kwargs)
        con.commit()
        return
