from sqlalchemy import create_engine, text
from config import connection_string

connection_string = connection_string
engine = create_engine(
    connection_string, connect_args={"ssl": {"ssl_ca": "/etc/ssl/cert.pem"}}
)


def select_data(query, **kwargs):
    with engine.connect() as con:
        stmt = text(query)
        result = con.execute(stmt, kwargs).all()
        results_list = []
        for row in result:
            results_list.append(row._asdict())
        return results_list


def update_db(query, **kwargs):
    with engine.connect() as con:
        stmt = text(query)
        con.execute(stmt, kwargs)
        con.commit()
        return
