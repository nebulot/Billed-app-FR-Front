/**
 * @jest-environment jsdom
 */

//import { screen } from "@testing-library/dom"
import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

//add new import 
import BillsUI from "../views/BillsUI.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import mockStore from "../__mocks__/store"
import router from "../app/Router"

jest.mock("../app/Store", () => mockStore)

//initial test code
describe("Given I am connected as an employee", () => {
  /*describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})*/
beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })// Set localStorage
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))// Set user as Employee in localStorage
    const html = NewBillUI()
    document.body.innerHTML = html
    
  })
  describe("When I select a file", () => {
    test("Then it should be changed in the input", () => {
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
        store: mockStore,
        localStorage: window.localStorage
      })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener('change', handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["myFile.png"], "myFile.png", { type: "image/png" })]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("myFile.png");
    })
  })
  describe("When I submit the form", () => {
    test('It should create a new bill', () => {
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
        store: mockStore,
        localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const newBillform = screen.getByTestId("form-new-bill")
      newBillform.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillform)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

// test d'intégration Post
describe("Given I am connected as an employee and on NewBill Page", () => {
  describe("When I submit the form", () => {
    test('It should create a new bill', async () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })// Set localStorage
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))// Set user as Employee in localStorage
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
        store: mockStore,
        localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const newBillform = screen.getByTestId("form-new-bill")
      newBillform.addEventListener('submit', handleSubmit)
      const date = "2002-02-02"
      const amount = "100"
      const pct = "10"
      const file = "preview-facture-free-201801-pdf-1.jpg"
      const inputDate = screen.getByTestId("datepicker")
      const inputAmount = screen.getByTestId("amount")
      const inputPct = screen.getByTestId("pct")
      const inputFile = screen.getByTestId("file")
      fireEvent.change(inputDate, { target: { value: date } })
      fireEvent.change(inputAmount, { target: { value: amount } })
      fireEvent.change(inputPct, { target: { value: pct } })
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["myFile.png"], "myFile.png", { type: "image/png" })]
        }
      })
      const bill = {
        date: date,
        amount: amount,
        pct: pct,
        file: file

      }
      fireEvent.submit(newBillform)
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
      jest.spyOn(mockStore, "bills")
      mockStore.bills.mockImplementation(() => {
        return {
          create: () => {
            return Promise.resolve(bill)
          }
        }
      })
      expect(handleSubmit).toHaveBeenCalled()
    }
    )
  }
  )
}
)
