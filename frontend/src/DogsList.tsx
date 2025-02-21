import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Dog } from "./Types.tsx";

const DogsList = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        fetch("http://localhost/dogs/all")
            .then(res => res.json())
            .then(fetchedDogs => setDogs(fetchedDogs));
    }, []);

    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            {
                auth.isAuthenticated ? "User logged in" : "Please log in to adopt a dog"
            }
            {
                !auth.isAuthenticated &&
                <button onClick={() => navigate("/login")}> Log in </button>
            }
            {
                dogs.map((dog, index) => (
                    <div key={index}>
                        {dog.name + " - " + dog.breed}
                        {
                            auth.isAuthenticated &&
                            <button onClick={() => navigate(`/dogs/${dog._id}`)}> See details </button>
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default DogsList;
