from sqlalchemy import create_engine, text
from config import connection_string

connection_string = connection_string
engine = create_engine(
    connection_string, connect_args={"ssl": {"ssl_ca": "/etc/ssl/cert.pem"}}
)


def select_data(query):
    with engine.connect() as con:
        result = con.execute(text(f"{query}")).all()

        results_list =  []
        for row in result:
            results_list.append(row._asdict())
        return results_list


def update_db(query):
    with engine.connect() as con:
        con.execute(text(f"{query}"))
        con.commit()
    return