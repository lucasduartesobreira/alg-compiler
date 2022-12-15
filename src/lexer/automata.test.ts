import Automata from './automata'
import { StateInfo, TypeofToken } from './automata.types'

type ExpectedStateInfo = Omit<StateInfo, 'state'>
type ExamplesToTest = Array<{
  stringToTest: string
  stateInfoExpected: ExpectedStateInfo
  expectedToBeAccepted: boolean
}>

const testAutomataToSet = (setOfExamples: ExamplesToTest) => {
  for (const example of setOfExamples) {
    const { stringToTest, stateInfoExpected, expectedToBeAccepted } = example
    let state = 0
    for (const char of stringToTest) {
      const returnFromAutomata = Automata.nextState(char, state)

      if (returnFromAutomata === -1) break
      state = returnFromAutomata
    }

    const { accepted, stateInfo } = Automata.acceptState(state)

    expect(accepted).toBe(expectedToBeAccepted)
    expect(stateInfo.description).toBe(stateInfoExpected.description)
    expect(stateInfo.classOfToken).toBe(stateInfoExpected.classOfToken)
    expect(stateInfo.typeOfToken).toBe(stateInfoExpected.typeOfToken)
  }
}

describe('Testing automata', () => {
  test('identify a number', () => {
    const stateInfoInteger: ExpectedStateInfo = {
      description: 'Número inteiro',
      classOfToken: 'NUM',
      typeOfToken: 'INTEIRO'
    }

    const stateInfoRealNumber: ExpectedStateInfo = {
      description: 'Número real',
      classOfToken: 'NUM',
      typeOfToken: 'REAL'
    }

    const stateInfoExpNumber: ExpectedStateInfo = {
      description: 'Número exponencial',
      classOfToken: 'NUM',
      typeOfToken: 'REAL'
    }

    const numberExamples = [
      {
        stringToTest: '0',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9',
        stateInfoExpected: stateInfoInteger,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.0',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.00',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.1',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.11',
        stateInfoExpected: stateInfoRealNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '0E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '1E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '2E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '3E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '4E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '5E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '6E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '7E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '8E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '9E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.01e1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.01E1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.01e+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.01E+1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.01e-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '10.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '11.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '12.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '13.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '14.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '15.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '16.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '17.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '18.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '19.01E-1',
        stateInfoExpected: stateInfoExpNumber,
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(numberExamples)
  })

  test('identify a literal', () => {
    const stateInfoExpected: ExpectedStateInfo = {
      description: 'Literal',
      classOfToken: 'LIT',
      typeOfToken: 'LITERAL'
    }

    const literalExamples = [
      {
        stringToTest:
          '"abcdefghijklmnopqrstuvwxyz0123456789,;:!?\\*+-/(){}||<>=_"',
        stateInfoExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest:
          '"abcdefghijklmnopqrstuvwxyz0123456789,;:!?\\*+-/(){}||<>=_ abcdefghijklmnopqrstuvwxyz0123456789,;:!?\\*+-/(){}||<>=_"',
        stateInfoExpected,
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(literalExamples)
  })

  test('identify an id', () => {
    const stateInfoIdExpected: ExpectedStateInfo = {
      description: 'Identifier',
      classOfToken: 'ID',
      typeOfToken: 'NULO'
    }

    const idExamples = [
      {
        stringToTest: 'A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'B',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'C',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'D',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'E',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'F',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'G',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'H',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'I',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'J',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'K',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'L',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'M',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'N',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'O',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'P',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Q',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'R',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'S',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'T',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'U',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'V',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'W',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'X',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Y',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Z',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'a',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'b',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'c',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'd',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'e',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'f',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'g',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'h',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'i',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'j',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'k',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'l',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'm',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'n',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'o',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'p',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'q',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'r',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 's',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 't',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'u',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'v',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'w',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'x',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'y',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'z',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'AA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'BA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'CA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'DA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'EA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'FA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'GA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'HA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'IA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'JA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'KA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'LA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'MA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'NA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'OA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'PA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'QA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'RA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'SA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'TA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'UA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'VA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'WA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'XA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'YA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'ZA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'aA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'bA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'cA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'dA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'eA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'fA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'gA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'hA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'iA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'jA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'kA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'lA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'mA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'nA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'oA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'pA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'qA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'rA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'sA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'tA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'uA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'vA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'wA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'xA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'yA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'zA',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'A1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'B1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'C1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'D1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'E1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'F1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'G1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'H1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'I1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'J1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'K1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'L1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'M1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'N1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'O1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'P1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Q1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'R1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'S1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'T1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'U1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'V1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'W1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'X1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Y1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Z1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'a1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'b1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'c1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'd1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'e1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'f1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'g1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'h1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'i1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'j1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'k1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'l1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'm1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'n1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'o1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'p1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'q1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'r1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 's1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 't1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'u1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'v1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'w1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'x1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'y1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'z1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'A_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'B_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'C_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'D_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'E_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'F_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'G_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'H_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'I_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'J_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'K_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'L_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'M_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'N_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'O_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'P_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Q_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'R_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'S_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'T_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'U_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'V_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'W_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'X_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Y_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'Z_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'a_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'b_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'c_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'd_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'e_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'f_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'g_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'h_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'i_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'j_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'k_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'l_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'm_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'n_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'o_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'p_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'q_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'r_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 's_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 't_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'u_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'v_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'w_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'x_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'y_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'z_',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'AAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'BAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'CAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'DAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'EAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'FAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'GAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'HAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'IAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'JAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'KAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'LAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'MAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'NAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'OAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'PAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'QAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'RAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'SAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'TAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'UAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'VAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'WAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'XAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'YAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'ZAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'aAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'bAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'cAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'dAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'eAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'fAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'gAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'hAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'iAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'jAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'kAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'lAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'mAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'nAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'oAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'pAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'qAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'rAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'sAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'tAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'uAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'vAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'wAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'xAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'yAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'zAa',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'AA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'BA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'CA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'DA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'EA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'FA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'GA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'HA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'IA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'JA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'KA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'LA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'MA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'NA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'OA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'PA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'QA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'RA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'SA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'TA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'UA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'VA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'WA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'XA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'YA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'ZA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'aA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'bA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'cA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'dA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'eA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'fA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'gA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'hA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'iA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'jA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'kA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'lA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'mA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'nA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'oA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'pA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'qA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'rA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'sA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'tA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'uA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'vA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'wA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'xA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'yA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'zA1',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'AA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'BA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'CA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'DA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'EA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'FA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'GA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'HA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'IA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'JA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'KA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'LA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'MA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'NA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'OA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'PA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'QA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'RA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'SA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'TA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'UA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'VA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'WA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'XA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'YA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'ZA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'aA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'bA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'cA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'dA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'eA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'fA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'gA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'hA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'iA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'jA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'kA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'lA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'mA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'nA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'oA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'pA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'qA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'rA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'sA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'tA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'uA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'vA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'wA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'xA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'yA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest: 'zA_1A',
        stateInfoExpected: stateInfoIdExpected,
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(idExamples)
  })

  test('identify a commentary', () => {
    const stateInfoCommentExpected: ExpectedStateInfo = {
      description: 'Commentary',
      classOfToken: 'COMMENT',
      typeOfToken: 'NULO'
    }

    const commentExamples = [
      {
        stringToTest:
          '{"abcdefghijklmnopqrstuvwxyz0123456789,;:!?\\*+-/()||<>=_"}',
        stateInfoExpected: stateInfoCommentExpected,
        expectedToBeAccepted: true
      },
      {
        stringToTest:
          '{abcdefghijklmnopqrstuvwxyz0123456789,;:!?\\*+-/()||<>=_" abcdefghijklmnopqrstuvwxyz0123456789,;:!?\\*+-/()||<>=_"}',
        stateInfoExpected: stateInfoCommentExpected,
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(commentExamples)
  })

  test('identify EOF', () => {
    const state = Automata.nextState('EOF', 0)

    const accepted = Automata.acceptState(state)

    expect(accepted.accepted).toBeTruthy()
    expect(accepted.stateInfo.classOfToken).toBe('EOF')
    expect(accepted.stateInfo.description).toBe('End of file')
  })

  test('identify OPR', () => {
    const oprExamples: ExamplesToTest = [
      {
        stringToTest: '>',
        stateInfoExpected: {
          classOfToken: 'OPR',
          description: '>',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      },
      {
        stringToTest: '>=',
        stateInfoExpected: {
          classOfToken: 'OPR',
          description: '>=',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      },
      {
        stringToTest: '<',
        stateInfoExpected: {
          classOfToken: 'OPR',
          description: '<',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      },
      {
        stringToTest: '<=',
        stateInfoExpected: {
          classOfToken: 'OPR',
          description: '<=',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      },
      {
        stringToTest: '<>',
        stateInfoExpected: {
          classOfToken: 'OPR',
          description: '<>',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(oprExamples)
  })

  test('identify ATR', () => {
    const atrExamples: ExamplesToTest = [
      {
        stringToTest: '<-',
        stateInfoExpected: {
          classOfToken: 'ATR',
          description: '<-',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(atrExamples)
  })

  test('identify OPA', () => {
    const stateInfo: ExpectedStateInfo = {
      classOfToken: 'OPA',
      description: 'Arithmetic Operator',
      typeOfToken: 'NULO'
    }
    const opaExamples = [
      {
        stringToTest: '+',
        stateInfoExpected: stateInfo,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '-',
        stateInfoExpected: stateInfo,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '*',
        stateInfoExpected: stateInfo,
        expectedToBeAccepted: true
      },
      {
        stringToTest: '/',
        stateInfoExpected: stateInfo,
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(opaExamples)
  })

  test('identify AB_P', () => {
    const ab_pExamples: ExamplesToTest = [
      {
        stringToTest: '(',
        stateInfoExpected: {
          classOfToken: 'AB_P',
          description: '(',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(ab_pExamples)
  })

  test('identify FC_P', () => {
    const fc_pExamples: ExamplesToTest = [
      {
        stringToTest: ')',
        stateInfoExpected: {
          classOfToken: 'FC_P',
          description: ')',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(fc_pExamples)
  })

  test('identify PT_V', () => {
    const pt_vExamples: ExamplesToTest = [
      {
        stringToTest: ';',
        stateInfoExpected: {
          classOfToken: 'PT_V',
          description: ';',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(pt_vExamples)
  })

  test('identify VIR', () => {
    const virExamples: ExamplesToTest = [
      {
        stringToTest: ',',
        stateInfoExpected: {
          classOfToken: 'VIR',
          description: ',',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: true
      }
    ]

    testAutomataToSet(virExamples)
  })

  test('identify ERROR', () => {
    const errorExamples: ExamplesToTest = [
      {
        stringToTest: '.1',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro token fora do padrão',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1.',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro número real incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1e',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1.0E',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1E',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1.00E',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1.00e',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1e+',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1E+',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1e-',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '1E-',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro exponencial incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '"abcdef',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro literal incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '"abcdefaskdhfj',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro literal incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '"abcdefaskdhfj aalsdjkfh /?,.;12340981905823asdhbvc ',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro literal incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '_abc',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro token fora do padrão',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '{adhsjkf asjdhfk 1234 83470982457+',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro comentário incompleto',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '@&¨a',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro caractere inválido',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: 'abcd@abcd',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro caractere inválido',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '123abcd',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro caractere inesperado',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      },
      {
        stringToTest: '123.abcd',
        stateInfoExpected: {
          classOfToken: 'ERROR',
          description: 'Erro caractere inesperado',
          typeOfToken: 'NULO'
        },
        expectedToBeAccepted: false
      }
    ]

    testAutomataToSet(errorExamples)
  })
})
