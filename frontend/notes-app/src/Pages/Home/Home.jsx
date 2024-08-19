import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false, type: "add", data: null });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown:true,type:"edit",data:noteDetails})
  }

  // Get user info
  const getUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-user");

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }


  };

//get all notes
  const getAllNotes=async ()=>{
    try{
      const response=await axiosInstance.get("/get-all-notes");
      if(response.data&& response.data.notes){
        setAllNotes(response.data.notes);
      }

    }catch(error){
      console.log("An unexpected error.")

    }
  }




  

  useEffect(() => {
    getAllNotes(); 
    getUserInfo();

  return () => {
    };
  }, []);

  const handleOpenModal = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null });
  };

  const handleCloseModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  return (
    <>
      {userInfo && <Navbar userInfo={userInfo} />}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item,index)=>(
             <NoteCard
             key={item._id}
             title={item.title}
             date={item.createdOn}
             content={item.content}
             tags={item.tags}
             isPinned={item.isPinned}
             onEdit={() => handleEdit(item)}
             onDelete={() => {}}
             onPinNote={() => {}}
           />

          ))};
           
          </div>
        </div>
      )}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={handleOpenModal}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        contentLabel="Add or Edit Note"
        onBlur={handleCloseModal}
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={()=>{setOpenAddEditModal({isShown:false,type:"add",data:null});
        }}
        getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;