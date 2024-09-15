type Contenido = {
  titulo: string;
  subtitulos?: string[];
};

type Docente = {
  nombre: string;
  foto: string;
  bio: string;
};

type Curso = {
  categoria: string;
  subcategoria: string;
  imagen: string;
  slug: string;
  titulo: string;
  justificacion: string;
  competencia: string;
  contenidos: Contenido[];
  docente: Docente;
};

export type { Curso };