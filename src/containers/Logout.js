import { ROUTES_PATH } from '../constants/routes.js'

/* clear the local storage */
/* navigate to the login page*/
/*when user click on the btn disconnected*/
export default class Logout {
  constructor({ document, onNavigate, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.localStorage = localStorage
    $('#layout-disconnect').click(this.handleClick)
  }

  /* clear the local storage */
/* navigate to the login page*/  
  handleClick = (e) => {
    this.localStorage.clear()
    this.onNavigate(ROUTES_PATH['Login'])
  }
} 