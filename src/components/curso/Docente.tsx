import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Docente = {
    nombre: string;
    foto: string;
    bio: string;
};

function Docente({ nombre, foto, bio }: Docente) {
    return (
        <div className="flex items-center space-x-4 mb-4">
            <Avatar>
                <AvatarImage src={'/images/' + foto} alt={nombre} />
            </Avatar>
            <div>
                <h3 className="font-semibold">{nombre}</h3>
                <p className="text-sm text-gray-500">{bio}</p>
            </div>
        </div>
    )
}

export default Docente