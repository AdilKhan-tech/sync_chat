import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

function ArchivePinModal() {

  const [pin,setPin] = useState("");

  const {
    showArchiveLock,
    setShowArchiveLock,
    verifyArchivePin
  } = useChatStore();


  if(!showArchiveLock) return null;


  const submit = () => {

    const success = verifyArchivePin(pin);

    if(!success){
      toast.error("Wrong archive PIN");
      return;
    }

    setPin("");
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-zinc-900 p-6 rounded-xl w-80">

        <div className="flex justify-between mb-5">

          <h2 className="text-white font-semibold">
            Archive PIN
          </h2>

          <button
          onClick={()=>setShowArchiveLock(false)}
          >
            <X/>
          </button>

        </div>


        <input
        type="password"
        maxLength={4}
        value={pin}
        onChange={(e)=>setPin(e.target.value)}
        placeholder="Enter PIN"
        className="input-field w-full"
        />


        <button
        onClick={submit}
        className="btn-primary w-full mt-4"
        >
          Unlock
        </button>

      </div>

    </div>
  );
}

export default ArchivePinModal;