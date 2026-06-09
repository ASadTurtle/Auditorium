import GeneratePage from "@/components/layout/generatePage";
import { useParams } from "react-router";

export default function Room() {
  const { roomId } = useParams();
  return (
    <GeneratePage children={undefined} title={"Dummy Room"}>
    
    </GeneratePage>
  )
}