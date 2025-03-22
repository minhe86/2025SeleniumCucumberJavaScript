@ui
@debug
Feature: Login and Verify error message for invalid credentials.

  Scenario Outline: Login to SwagLabs application, verify an error message is displayed for invalid username/passoword or locked out user.
    Given User launches SwagLabs application URL
    Then User is directed to "Login" page
    When User logs in the app using username "<UserName>" and password "<Password>"
    Then User can see error message for "<UserName>" and "<Password>" on Login page

    Examples:
      | UserName        | Password     |
      | standard_user   | randomPW     |
      | randomUser      | secret_sauce |
      | locked_out_user | secret_sauce |
