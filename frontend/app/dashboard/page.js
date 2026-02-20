"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [Loader, setLoader] = useState(true);
  const [Tasks, setTasks] = useState([]);
  const [FilteredTasks, setFilteredTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [Form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [showEditOption, setShowEditOption] = useState("");
  const [updatedForm, setUpdatedForm] = useState({
    id: "",
    title: "",
    description: "",
    tags: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [showDeleteMessage, setShowDeleteMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    getTasks();
  }, []);

  async function getTasks() {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/getTask`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 402) {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }
    const data = await response.json();
    setTasks(data.tasks);
    setLoader(false);
  }

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function addTaskHandler() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/addTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: Form.title,
            description: Form.description,
            tags: Form.tags,
            status: "In-Progress",
          }),
        }
      );
      if (response.status === 201) {
        setForm({
          title: "",
          description: "",
          tags: "",
        });
        setShowPopup(false);
        await getTasks();
      }
    } catch (err) {
      console.log("Error adding task", err);
    }
  }

  const handleUpdatedInputChange = (e) => {
    setUpdatedForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function editTaskHandler() {
    try {
      if(!updatedForm.title){
        return alert('Title is required');
      }
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/editTask/${updatedForm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: updatedForm.title,
            description: updatedForm.description,
            tags: updatedForm.tags,
            status: updatedForm.status,
          }),
        }
      );
      if (response.status === 201) {
        setShowEditOption(false);
        await getTasks();
      }
    } catch (err) {
      console.log("Error adding task", err);
    }
  }

  async function handleDeleteTask() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/deleteTask/${showDeleteMessage}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setShowDeleteMessage("");
        await getTasks();
      }
    } catch (err) {
      console.log("Error deleting task", err);
    }
  }

  async function statusHandler(status, id) {
    console.log("Status received-->", status);
    console.log("Id received-->", id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/editTask/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );
      if (response.status === 201) {
        await getTasks();
      }
    } catch (err) {
      console.log("Error adding task", err);
    }
  }

  function handleSearchChange(e){
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);
  
    if(search.trim().length > 0){
      const tasks = Tasks.filter(task => (
        task.title.toLowerCase().includes(search) || 
        task.tags?.toLowerCase().includes(search)
      ));
      setFilteredTasks(tasks);
    }
    else{
      setFilteredTasks([]);
    }
  }

  function handleSort(type){
    setActiveFilter('');
    setFilteredTasks([])
    if(type === 'completed'){
      const tasks = Tasks.filter(task => (task.status === 'Completed'));
      setActiveFilter('completed')
      setFilteredTasks(tasks)
      console.log(tasks);
    }
    if(type === 'inProgress'){
      const tasks = Tasks.filter(task => (task.status === 'In-Progress'));
      setActiveFilter('inProgress')
      setFilteredTasks(tasks)
      console.log(tasks);
    }
    if(type === 'first'){
      const tasks = [...Tasks].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      setActiveFilter('first')
      setFilteredTasks(tasks)
      console.log(tasks);
    }
    if(type === 'last'){
      const tasks = [...Tasks].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setActiveFilter('last')
      setFilteredTasks(tasks)
      console.log(tasks);
    }
  }

  const tasksToRender = 
  FilteredTasks.length > 0 || searchTerm.length > 0 || activeFilter
    ? FilteredTasks
    : Tasks;

  return (
    <div className="text-white bg-linear-to-r from-[#3F5EFB] to-[#FC466B]">
      <title>Dashboard</title>
      <div className="min-h-[90vh]">
        <Header />
        {Loader ? (
          <div className="min-h-[50vh] flex flex-col justify-center items-center">
            <img src="/gear-spinner.svg" className="h-10" />
            <span className="text-[18px] font-bold">Please wait...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-[24px] font-bold mb-10">Task Dashboard</h1>
            <div className={`flex flex-col items-start gap-2`}>
              {Tasks.length > 0 && (
                <div className="w-full flex flex-col gap-7">
                  <div className="flex justify-center gap-10">
                    {showFilter ? 
                      <div className="flex gap-2">
                        <button
                          className={`${activeFilter === 'completed' ? 'bg-[#ffffff36]' : ''} cursor-pointer flex justify-center gap-3 items-center border-2 border-[#ffffff] px-2 py-1 rounded-full`}
                          onClick={() => handleSort('completed')}
                        >
                          Completed
                        </button>
                        <button
                          className={`${activeFilter === 'inProgress' ? 'bg-[#ffffff36]' : ''} cursor-pointer flex justify-center gap-3 items-center border-2 border-[#ffffff] px-2 py-1 rounded-full`}
                          onClick={() => handleSort('inProgress')}
                        >
                          In-Progress
                        </button>
                        <button
                          className={`${activeFilter === 'first' ? 'bg-[#ffffff36]' : ''} cursor-pointer flex justify-center gap-3 items-center border-2 border-[#ffffff] px-2 py-1 rounded-full`}
                          onClick={() => handleSort('first')}
                        >
                          First Added
                        </button>
                        <button
                          className={`${activeFilter === 'last' ? 'bg-[#ffffff36]' : ''} cursor-pointer flex justify-center gap-3 items-center border-2 border-[#ffffff] px-2 py-1 rounded-full`}
                          onClick={() => handleSort('last')}
                        >
                          Last Added
                        </button>
                      </div>
                    :
                      <div className={`flex gap-3 items-center border-2 ${searchTerm.length > 0 ? 'border-[#ffffff]' : 'border-[#ffffff76]' } px-2 py-1 rounded-full`}>
                        <img src='/search.svg' className="h-5"/>
                        <input 
                          className="w-90 text-white focus:outline-none"
                          type="text"
                          placeholder="Search Task..."
                          onChange={handleSearchChange}
                        />
                      </div>
                    }
                    <button 
                      className={`${showFilter ? 'bg-[#ffffff36]' : ''} cursor-pointer flex justify-center w-15 gap-3 items-center border-2 border-[#ffffff] px-2 py-1 rounded-full`}
                      onClick={() => {setActiveFilter(''); setShowFilter(!showFilter); setFilteredTasks([]);}}
                    >
                      <img src='/filter.svg' className="h-5"/>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-green-700 hover:bg-green-800 w-30 cursor-pointer border-gray-200 border rounded-md p-1"
                  >
                    <span>
                      <span className="text-[18px] font-bold">+</span> Add Task{" "}
                    </span>
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-4 items-center justify-center">
                {Tasks.length > 0 ? (
                  tasksToRender.map((task, index) => (
                    <div>
                      <div
                        key={index}
                        className={`bg-[#ffffff15] hover:bg-[#ffffff3f] w-full min-w-xl max-w-4xl flex justify-between p-4 border-2 border-gray-200 rounded-md gap-5 ${
                          showDeleteMessage === task._id
                            ? "rounded-none rounded-t-md "
                            : ""
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          {showEditOption === task._id ? (
                            <input
                              className="w-90 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                              type="text"
                              name="title"
                              value={updatedForm.title}
                              placeholder="Title"
                              onChange={handleUpdatedInputChange}
                              required
                            />
                          ) : (
                            <h2 className="font-semibold text-2xl">
                              {task.title}
                            </h2>
                          )}
                          {showEditOption === task._id ? (
                            <textarea
                              className="w-90 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                              type="text"
                              name="description"
                              rows={4}
                              value={updatedForm.description}
                              placeholder="Description (Optional)"
                              onChange={handleUpdatedInputChange}
                            />
                          ) : (
                            <p className="font-medium text-[17px] max-w-100">
                              {task.description}
                            </p>
                          )}
                          {showEditOption === task._id ? (
                            <input
                              className="w-90 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                              type="text"
                              name="tags"
                              value={updatedForm.tags}
                              placeholder="Tags (Optional)"
                              onChange={handleUpdatedInputChange}
                            />
                          ) : (
                            <p className="font-light text-sm mt-3 max-w-100 truncate">
                              {task.tags}
                            </p>
                          )}
                          {showEditOption === task._id ? (
                            <div className="flex flex-row gap-3 mt-4">
                              <button
                                onClick={() => setShowEditOption(false)}
                                className="w-25 cursor-pointer text-white px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#d5d5d53f] duration-100"
                              >
                                Cancel
                              </button>
                              <button
                                className="w-25 bg-[#1d459cc7] cursor-pointer text-white px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#1d4e9ce9] duration-100"
                                onClick={editTaskHandler}
                              >
                                Update
                              </button>
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          {showEditOption === task._id ? (
                            <select
                              value={updatedForm.status}
                              name="status"
                              className={`cursor-pointer px-2 py-1 border border-gray-200 rounded-sm`}
                              onChange={handleUpdatedInputChange}
                            >
                              <option
                                value="In-Progress"
                                className="text-black cursor-pointer"
                              >
                                In-Progress
                              </option>
                              <option
                                value="Completed"
                                className="text-black cursor-pointer"
                              >
                                Completed
                              </option>
                            </select>
                          ) : (
                            <select
                              className={`cursor-pointer px-2 py-1 border border-gray-200 rounded-sm ${
                                task.status === "In-Progress"
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                              }`}
                              value={task.status}
                              onChange={(e) =>
                                statusHandler(e.target.value, task._id)
                              }
                            >
                              <option
                                className="cursor-pointer"
                                value="In-Progress"
                              >
                                In-Progress
                              </option>
                              <option
                                className="cursor-pointer"
                                value="Completed"
                              >
                                Completed
                              </option>
                            </select>
                          )}
                          <div className="flex flex-row gap-3">
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                setShowDeleteMessage("");
                                setUpdatedForm({
                                  id: task._id,
                                  title: task.title,
                                  description: task.description,
                                  tags: task.tags,
                                  status: task.status,
                                });
                                setShowEditOption(task._id);
                              }}
                            >
                              <img src="/edit.svg" className="h-5" />
                            </button>
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                setShowEditOption(""),
                                  setShowDeleteMessage(task._id);
                              }}
                            >
                              <img src="/delete.svg" className="h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {showDeleteMessage === task._id && (
                        <div className="border-x-2 border-b-2 rounded-b-md p-4 flex flex-col gap-5 items-center">
                          <p>Are you sure you want to delete this task?</p>
                          <div className="flex flex-row gap-4">
                            <button
                              className="rounded-md cursor-pointer px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#d5d5d53f] duration-100"
                              onClick={() => setShowDeleteMessage("")}
                            >
                              Cancel
                            </button>
                            <button
                              className="rounded-md border-2 px-2 py-1 bg-[#ce0f0f96] hover:bg-[#ce0f0ff3] duration-100 cursor-pointer"
                              onClick={handleDeleteTask}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-3 items-center">
                    <span className="text-[18px] font-semibold">
                      Add your first task
                    </span>
                    <button
                      onClick={() => setShowPopup(true)}
                      className="bg-green-700 hover:bg-green-800 w-30 cursor-pointer border-gray-200 border rounded-md p-1"
                    >
                      <span>
                        <span className="text-[18px] font-bold">+</span> Add
                        Task{" "}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {showPopup && (
        <div className="fixed z-999 inset-0 flex justify-center items-center backdrop-blur-sm bg-black/50">
          <div className="bg-[#ffffff2a] flex flex-col justify-between items-center gap-5 rounded-lg border-2 border-white p-10 shadow-2xl">
            <h2 className="text-white font-semibold text-2xl">
              Add a new task
            </h2>
            <div className="flex flex-col items-center">
              <input
                className="w-100 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                type="text"
                name="title"
                value={Form.title}
                placeholder="Title"
                onChange={handleInputChange}
                required
              />
              <br />
              <textarea
                className="w-100 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                type="text"
                name="description"
                rows={4}
                value={Form.description}
                placeholder="Description (Optional)"
                onChange={handleInputChange}
              />
              <br />
              <input
                className="w-100 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                type="text"
                name="tags"
                value={Form.tags}
                placeholder="Tags (Optional)"
                onChange={handleInputChange}
              />
              <br />
              <div className="flex flex-row gap-3 mt-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-44.5 cursor-pointer text-white px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#d5d5d53f] duration-100"
                >
                  Cancel
                </button>
                <button
                  className="w-44.5 bg-[#1d9c1fc7] cursor-pointer text-white px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#1d9c1fe9] duration-100"
                  onClick={addTaskHandler}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
