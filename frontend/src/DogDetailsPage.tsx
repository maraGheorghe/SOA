import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dog } from "./Types.tsx";
import { useAuth } from "./AuthContext.tsx";

const DogDetailsPage = () => {
    const { dogId } = useParams();
    const [dog, setDog] = useState<Dog>();

    useEffect(() => {
        fetch(`http://localhost/dogs/${dogId}`)
            .then(res => res.json())
            .then(fetchedDog => setDog(fetchedDog));
    }, [dogId]);

    const auth = useAuth();

    const onAdopt = () => {
        fetch(`http://localhost/dogs/${dogId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: auth.token }),
        })
        .then(() => {
            alert("Adoption request submitted successfully!");
        })
        .catch((err) => {
            console.log(err);
            alert("Could not submit adoption request!");
        });
    };

    if (!dog) {
        return null;
    }

    return (
        <div>
            <div>
                {dog.name + " - " + dog.breed + " - Age: " + dog.age + " - Size: " + dog.size}
            </div>
            <div>
                <button onClick={onAdopt}> Adopt </button>
            </div>
        </div>
    );
}

export default DogDetailsPage;
