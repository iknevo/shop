import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <div>
          <Button variant={"elevated"}>I am a button</Button>
        </div>

        <div>
          <Input placeholder="i am an imput" />
        </div>

        <div>
          <Progress value={50} />
        </div>

        <div>
          <Textarea placeholder={"i'm a textarea"} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox />
          <Checkbox defaultChecked />
        </div>
      </div>
    </div>
  );
}
