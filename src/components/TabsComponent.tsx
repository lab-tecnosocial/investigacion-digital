import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function TabsComponent({curso}) {
  return (
    <Tabs defaultValue="curriculum" >
    <TabsList>
      <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
      <TabsTrigger value="instructor">Instructor</TabsTrigger>
    </TabsList>
    <TabsContent value="curriculum">
      <ul className="list-disc pl-5 space-y-2">
        {curso.contenidos}
      </ul>
    </TabsContent>
    <TabsContent value="instructor">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar />
        <div>
          <h3 className="font-semibold">
            {}
          </h3>
          <p className="text-sm text-gray-500">
            {}
          </p>
        </div>
      </div>
    </TabsContent>
  </Tabs>
  )
}

export default TabsComponent