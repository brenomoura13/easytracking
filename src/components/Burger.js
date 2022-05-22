import { faBoxOpen, faPencil, faTimeline, faArrowRightFromBracket, faInfo, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signOut } from "next-auth/react"
import { elastic as Menu } from 'react-burger-menu'

var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '26px',
    height: '20px',
    left: '36px',
    top: '36px'
  },
  bmBurgerBars: {
    background: '#7c3aed'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '30px',
    width: '30px'
  },
  bmCross: {
    background: 'rgb(241 245 249)'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: 'rgb(76 29 149)',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: 'rgb(76 29 149)'
  },
  bmItemList: {
    color: 'rgb(241 245 249)',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}

const BurgerMenu = () => {
  return (
    <header>     
    <nav className="font-montserrat text-slate-100 justify-around">   
      <Menu styles={ styles }>
        <ul>
          <li className="mb-6"><FontAwesomeIcon icon={faUser} className="mr-3 text-teal-300 w-8" />
            Sua conta
          </li>
          <li className="mb-6"><FontAwesomeIcon icon={faBoxOpen} className="mr-3 text-orange-300 w-8" />
            Encomendas
          </li>
          <li className="mb-6"><FontAwesomeIcon icon={faPencil} className="mr-3 text-green-300 w-8" />
            Novo
          </li>
          <li className="mb-6"><FontAwesomeIcon icon={faTimeline} className="mr-3 text-sky-300 w-8" />
            Histórico
          </li>
          <li className="mb-6"><FontAwesomeIcon icon={faInfo} className="mr-3 text-violet-300 w-8" />
            Créditos
          </li>
          <li className="mb-6"><FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-3 text-rose-500 w-8" />
          <button onClick={signOut}>Sair</button>
          </li> 
        </ul>
      </Menu>
    </nav>
  </header> 
  )
}

export default BurgerMenu