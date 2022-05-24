import './App.css';
import { useState, useEffect }from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'

const API = 'http://localhost:5000'

function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] =useState(false)

  //Load todos on page load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err))

      setLoading(false)
      setTodos(res)
    }
    loadData()
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault()
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    console.log(todo)

    //Envio para API
    await fetch(API + "/todos",{
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTodos((prevState) => [...prevState, todo])

    //Limpa Imputs
    setTitle("")
    setTime("")
  }
  const handleDelete = async(id) => {

      await fetch(API + "/todos/" + id ,{
      method: "DELETE",
     })
     setTodos((prevState) => prevState.filter((todo) => todo.id !==id))
  }

  const handleEdit = async(todo) =>{
    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id,{
      method : "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })
    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data): t)))
  }


  if(loading){
    return <p>carregando...</p>
  }


  return (
    <div className='App'>
        <div className='todoHeader'>
          <h1>React Todo</h1>
        </div>
        <div className='formTodo'>
          <h2>Insira sua proxima Tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className='formControl'>
              <label htmlFor='title'>O que voce vai fazer?</label>
              <input 
              type='text' 
              name='title' 
              placeholder='Titulo Da Tarefa' 
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
              />
            </div>
            <div className='formControl'>
              <label htmlFor='time'>Duracao:</label>
              <input 
              type='text' 
              name='time' 
              placeholder='Tempo Da Tarefa' 
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
              />
            </div>
              <input type='submit' value='Criar Tarefa'/>
          </form>
        </div>
        <div className='listTodo'>
          <h2>Lista de Tarefas</h2>
          {todos.length === 0 && <p>Nao a Tarefas</p> }
          {todos.map((todo) => (
            <div className='todo' key={todo.id}>
              <h3 className={todo.done ? "todoDone" : ""}>{todo.title}</h3>
              <p>Duracao: {todo.time}</p>
              <div className='actions'>
                <span onClick={() => handleEdit(todo)}>
                  {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
                </span>
                <BsTrash onClick={() => handleDelete(todo.id)}/>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}

export default App;
