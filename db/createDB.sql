CREATE TABLE public.saves
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT saves_pkey PRIMARY KEY (id),
    CONSTRAINT utitle UNIQUE ("title")
);

CREATE TABLE public.events
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    label character varying(50) COLLATE pg_catalog."default" NOT NULL,
    save integer NOT NULL,
    isout boolean NOT NULL,
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_save_fkey FOREIGN KEY (save)
        REFERENCES public.saves (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE public.event_to_and
(
    event integer NOT NULL,
    toevent integer NOT NULL,
    CONSTRAINT ete UNIQUE (event, toevent),
    CONSTRAINT ete_fkey FOREIGN KEY (event)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT ete_fkey2 FOREIGN KEY (toevent)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE public.event_to_or
(
    event integer NOT NULL,
    toevent integer NOT NULL,
    CONSTRAINT ete2 UNIQUE (event, toevent),
    CONSTRAINT ete2_fkey FOREIGN KEY (event)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT ete2_fkey2 FOREIGN KEY (toevent)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE public.event_to_event
(
    event integer NOT NULL,
    toevent integer NOT NULL,
    CONSTRAINT ete3 UNIQUE (event),
    CONSTRAINT ete3_fkey FOREIGN KEY (event)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT ete3_fkey2 FOREIGN KEY (toevent)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE FUNCTION public.addin(
	label character varying,
	save integer,
	isout boolean)
    RETURNS integer
    LANGUAGE 'plpgsql'
AS $BODY$
declare
	res integer;
begin
	insert into events(label, save, isout) values (label, save, isout) returning id into res;
	return res;
end
$BODY$;

CREATE FUNCTION public.addsave(
	title character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
AS $BODY$
declare
	res integer;
begin
	insert into saves(title) values (title) returning id into res;
	return res;
end
$BODY$;

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