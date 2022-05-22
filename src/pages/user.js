import { faBoxOpen, faPencil, faTimeline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserInterface = () => {
  return (
    <header>
      <div class="p-4 space-y-2 bg-gray-600 rounded shadow">
        <span class="block w-8 h-0.5 bg-gray-100 animate-pulse"></span>
        <span class="block w-8 h-0.5 bg-gray-100 animate-pulse"></span>
        <span class="block w-8 h-0.5 bg-gray-100 animate-pulse"></span>
      </div>
      <nav>
        <ul>
          <li><FontAwesomeIcon icon={faBoxOpen} />Encomendas</li>
          <li><FontAwesomeIcon icon={faPencil} />Novo</li>
          <li><FontAwesomeIcon icon={faTimeline} />Histórico</li>
        </ul>
      </nav>
    </header> 
  );
}

export const getStaticProps = async (ctx) => {
  const { user } = await getSession(ctx)

  return {
    props:{
      data:null
    }
  }
}

export default UserInterface;