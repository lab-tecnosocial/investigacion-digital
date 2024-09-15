import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react'
import type { Curso as TCurso } from '@/data/cursosTypes';

export default function Curso({ curso }: { curso: TCurso }) {

  return (
    <main className="container mx-auto py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4" asChild >
        <a href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Vuelve al catalogo
        </a>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <img src={'/images/' + curso.imagen} alt={curso.titulo} className="w-full h-64 object-cover rounded-t-lg" />
          <CardTitle className="text-3xl mt-4">{curso.titulo}</CardTitle>
          <CardDescription><b>Competencia:</b> {curso.competencia}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Badge variant="secondary" className="flex items-center">
              <Clock className="mr-1 h-4 w-4" /> { }
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" /> { }
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <Users className="mr-1 h-4 w-4" /> { } inscritos
            </Badge>
          </div>

          <Tabs defaultValue="curriculum">
            <TabsList>
              <TabsTrigger value="curriculum">Contenido</TabsTrigger>
              <TabsTrigger value="instructor">Docente</TabsTrigger>
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
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={'/images/' + curso.docente.foto} alt={curso.docente.nombre} />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{curso.docente.nombre}</h3>
                  <p className="text-sm text-gray-500">{curso.docente.bio}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Inscribirse
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}