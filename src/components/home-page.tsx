import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search } from 'lucide-react'
import { SITE_DESCRIPTION, SITE_TITLE } from "@/consts"
import data from "@/data/cursos.json";

type Course = {
  categoria: string;
  subcategoria: string;
  imagen: string;
  titulo: string;
  justificacion: string;
  competencia: string;
  contenidos: string;
}

const courses = data as Course[];

// Extract unique categories
const categories = ["Todos", ...new Set(courses.map(course => course.categoria))]

export function HomePageComponent() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(course => 
    (selectedCategory === "Todos" || course.categoria === selectedCategory) &&
    course.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
 

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">{SITE_TITLE}</h1>
            <p className="text-xl mb-8">{SITE_DESCRIPTION}</p>
          </div>
        </section>

        {/* Course Catalog */}
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
                    <Button className="w-full">Ver más</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}