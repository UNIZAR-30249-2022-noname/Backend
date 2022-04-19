CREATE TABLE IF NOT EXISTS proyectodb.public.issue (
id SERIAL NOT NULL,
titulo character varying NOT NULL,
descripcion character varying NOT NULL,
estado integer NOT NULL,
etiquetas character varying NOT NULL,
espacioid character varying NOT NULL,
CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS proyectodb.public.reserve (
id SERIAL NOT NULL,
fecha character varying NOT NULL,
horainicio character varying NOT NULL,
horafin character varying NOT NULL,
persona character varying(50) NOT NULL,
espacioid character varying(50) NOT NULL,
CONSTRAINT "UQ_e4c4594ac6b6947f796de739ddd" UNIQUE (horainicio, fecha),
CONSTRAINT "PK_619d1e12dbedbe126620cac8240" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS proyectodb.public.space (
id character varying(50) NOT NULL,
name character varying(100) NOT NULL,
capacity integer NOT NULL,
building character varying(100) NOT NULL,
floor character varying(25) NOT NULL,
kind character varying(100) NOT NULL,
CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY (id)
);

ALTER TABLE proyectodb.public.issue
ADD CONSTRAINT "FK_ec29dcc5b2967e09c37cdc37d46" FOREIGN KEY (espacioid) REFERENCES space(id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE proyectodb.public.reserve
ADD CONSTRAINT "FK_69e7310ac700041e55a90da46c1" FOREIGN KEY (espacioid) REFERENCES space(id) ON DELETE NO ACTION ON UPDATE NO ACTION;