import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, LibraryBig } from 'lucide-react'
import Docente from './Docente'
import InscripcionForm from './InscripcionForm'

import type { Curso as TCurso } from '@/data/cursosTypes';

// Custom PocketBase route that returns only the count — List rule stays locked.
// See docs/pb_hooks/count.pb.js for the server-side code.
const PB_URL = 'https://pb.labtecnosocial.cloud'

export default function Curso({ curso }: { curso: TCurso }) {
  const [inscritos, setInscritos] = useState(0)

  useEffect(() => {
    fetch(`${PB_URL}/api/custom/count?slug=${encodeURIComponent(curso.slug)}`)
      .then(r => r.json())
      .then(data => { if (typeof data.count === 'number') setInscritos(data.count) })
      .catch(() => {})
  }, [curso.slug])

  return (
    <main>
      <img src={'/images/' + curso.imagen} alt={curso.titulo} className="w-full h-72 object-cover" />
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-3xl font-title text-center px-4">{curso.titulo}</h1>
        <h2 className="font-body my-2 px-4"><b>Competencia:</b> {curso.competencia}</h2>
        <Card className="font-body">
          <CardContent>
            <div className="flex flex-wrap gap-4 my-4 justify-center">
              <Badge variant="secondary" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" /> { }
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" /> { }
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Users className="mr-1 h-4 w-4" /> {inscritos} inscritos
              </Badge>
            </div>
            <Tabs defaultValue="curriculum">
              <TabsList className="flex justify-center">
                <TabsTrigger value="curriculum">Contenido</TabsTrigger>
                <TabsTrigger value="instructor">Docentes</TabsTrigger>
                <TabsTrigger value="inscripcion">Inscripción</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <ol className="list-decimal pl-5 space-y-2">
                  {curso.contenidos.map((item, index) => (
                    <>
                      <li key={index}>{item.titulo}</li>
                      {item.subtitulos && (
                        <ul className="list-disc pl-5 space-y-2">
                          {item.subtitulos.map((subitem, subindex) => (
                            <li key={subindex}>{subitem}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  ))}
                </ol>
              </TabsContent>
              <TabsContent value="instructor">
                {
                  curso.docentes.map((docente, index) => (
                    <Docente key={index} nombre={docente.nombre} foto={docente.foto} bio={docente.bio} />
                  ))
                }
              </TabsContent>
              <TabsContent value="inscripcion">
                <InscripcionForm cursoSlug={curso.slug} cursoTitulo={curso.titulo} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter />
        </Card>
      </div>
      <div className="flex justify-center">
        <Button variant="ghost" className="mb-4" asChild>
          <a href="/catalogo">
            <LibraryBig className="mr-2 h-4 w-4" /> Ver todos los cursos
          </a>
        </Button>
      </div>
    </main>
  )
}