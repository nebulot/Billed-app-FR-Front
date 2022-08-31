/**
 * @jest-environment jsdom
 */

/*

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";*/

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { billsfix } from "../fixtures/bills.js";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

/*test get*/

describe("Given I am connected as an employee", () => {
  describe("When page it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({ loading: true });
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("When page back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = BillsUI({ error: "some error message" });
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });
  describe("When I am on Bills Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      //document.body.innerHTML = BillsUI({ data: billsFix })
    });

    //test bill icon in vertical layout
    test("Then bill icon in vertical layout should be highlighted", async () => {
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    //test bills should be ordered its the same change just bills on billsFix
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: billsfix });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    // add test click on icon eye
    test("Then clic on one of iconEye, the modal should be displayed", () => {
      document.body.innerHTML = BillsUI({ data: billsfix });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const bills = new Bills({
        document,
        onNavigate,
        store,
        bills: billsfix,
        localStorage: window.localStorage
      });
      const handleClickIconEye = jest.fn(bills.handleClickIconEye);
      const eye = screen.getAllByTestId("icon-eye");
      eye[0].addEventListener("click", handleClickIconEye);
      userEvent.click(eye[0]);
      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = screen.getByTestId("modaleFile");
      expect(modale).toBeTruthy();
    });

    //add test click on btn new bill
    test("Then clic on button newBill the newBill page be displayed", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = jest.fn();
      const bills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(bills.handleClickNewBill);
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      buttonNewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(buttonNewBill);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });
});

//test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByText("Mes notes de frais"));
      const contentType = await screen.getByText("Type");
      expect(contentType).toBeTruthy();
      const contentName = await screen.getByText("Nom");
      expect(contentName).toBeTruthy();
      expect(screen.getByTestId("tbody")).toBeTruthy();
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
        //window on navigate
        window.onNavigate(ROUTES_PATH.Bills);
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
