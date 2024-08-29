import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import noteImg from "../../assets/add-note-svgrepo-com.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false, type: "add", data: null });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isSearch,setIsSearch]=useState(false);


  
  const [showToastMsg,setShowToastMsg]=useState({
    isShown: false,
    message:"",
    type:"add",
  });

  const showToastMessage=(message,type)=>{
    setShowToastMsg({
      isShown:true,
      message,
      type,
    });
  };

  const handleCloseToast=()=>{
    setShowToastMsg({
      isShown:false,
      message:"",
    });
  };


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

//delete a node
const deleteNode=async (data)=>{
  const noteId=data._id;
   try {
    const response = await axiosInstance.delete("/delete-note/" + noteId);

    if (response.data && !response.data.error) {
      showToastMessage("Note deleted Succesfully",'delete');
      getAllNotes();
    }
  } catch (error) {
   if(error.response &&
     error.response.data && 
     error.response.data.message
    ){
      console.log("An unexpected error.")
    }
  }
}

const onSearchNote =async (query)=>{
  try{
    const response=await axiosInstance.get("/search-notes",{
      params: { query }, // Pass the query parameter here
      
  });
  if(response.data && response.data.notes){
    setIsSearch(true);
    setAllNotes(response.data.notes);
  }
}catch(error){
  console.log(error);
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
      <Navbar userInfo={userInfo}  onSearchNote={onSearchNote} />
        <div className="container mx-auto">
          {allNotes.length>0 ?(<div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item,index)=>(
             <NoteCard
             key={item._id}
             title={item.title}
             date={item.createdOn}
             content={item.content}
             tags={item.tags}
             isPinned={item.isPinned}
             onEdit={() => handleEdit(item)}
             onDelete={() => {deleteNode(item)}}
             onPinNote={() => {}}
           />

          ))};
           
          </div>
        ):(
          <EmptyCard imgSrc={noteImg}
          message='Add you notes here'/>

        )}
        </div>
      
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
        showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}/>
    </>
  );
};

export default Home;