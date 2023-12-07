CREATE TABLE public.saves
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    CONSTRAINT saves_pkey PRIMARY KEY (id)
);

CREATE TABLE public.events
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    label character varying(50) COLLATE pg_catalog."default" NOT NULL,
    save integer NOT NULL,
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_save_fkey FOREIGN KEY (save)
        REFERENCES public.saves (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public.ands
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    p double precision NOT NULL,
    CONSTRAINT ands_pkey PRIMARY KEY (id),
    CONSTRAINT check_p CHECK (p >= 0::double precision AND p <= 1::double precision)
);


CREATE TABLE public.event_to_and
(
    event integer NOT NULL,
    "and" integer NOT NULL,
    CONSTRAINT ea UNIQUE (event, "and"),
    CONSTRAINT event_to_and_and_fkey FOREIGN KEY ("and")
        REFERENCES public.ands (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT event_to_and_event_fkey FOREIGN KEY (event)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE public."or"
(
    event integer NOT NULL,
    toevent integer NOT NULL,
    p double precision NOT NULL,
    CONSTRAINT ete UNIQUE (event, toevent),
    CONSTRAINT check_p2 CHECK (p >= 0::double precision AND p <= 1::double precision)
);

CREATE ROLE app WITH
  NOLOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  CONNECTION LIMIT 1
  ENCRYPTED PASSWORD 'SCRAM-SHA-256$4096:e1AAVXQS1zBkBf5kmKaEpA==$Pjq4sXFN+TVFGgW7vfydRKYQMiGPqUEdvb5QWW1yy3g=:2+ZxWSIVToT+syzk3ngR6zxZoqLnqq3gpFV3pNXJHyk=';

GRANT pg_write_all_data TO app;