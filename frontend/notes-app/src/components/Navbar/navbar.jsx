import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

const Navbar = () => {

  const [searchQuery,setSearchQuery]=useState("");

  const navigate = useNavigate();

  const onLogOut = () => {
    navigate("/logout");
  };

  const handleSearch =()=>{}
  const onClearSearch=()=>{setSearchQuery("")}

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h1 className="text-xl font-medium text-black py-2">Notes</h1>

      <SearchBar 
      value={searchQuery} 
      onChange={({target})=>
      {setSearchQuery(target.value)}}
      
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogOut={onLogOut} />
    </div>
  );
};

export default Navbar;
