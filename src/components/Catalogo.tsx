import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from 'lucide-react'
import data from "@/data/cursos.json";
import type { Curso as TCurso } from "@/data/cursosTypes";
const courses = data as TCurso[];

const categories = ["Todos", ...new Set(courses.map(course => course.categoria))]

export function Catalogo() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(course =>
    (selectedCategory === "Todos" || course.categoria === selectedCategory) &&
    course.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Nuestros cursos</h2>
        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <Card key={index}>
              <CardHeader>
                <img src={`/images/${course.imagen}`} alt={course.titulo} className="w-full h-48 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent>
                <CardTitle>{course.titulo}</CardTitle>
                <p className="text-sm text-gray-500">{course.categoria}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href={`/cursos/${course.slug}`}>Ver más</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}