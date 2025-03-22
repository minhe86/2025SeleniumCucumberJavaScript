@ui
Feature: Standard user login, purchase products, and log out.

  Scenario: Standard user login, add products to the cart, proceed to checkout and complete the purchase, then log out.
    Given User launches SwagLabs application URL
    Then User is directed to "Login" page
    When Standard user logs in
      | username | standard_user |
      | password | secret_sauce  |
    Then User is directed to "Home" page
    When User verifies the product details of product 2 on Home page
    When User adds products [0, 2] to the cart
    When User navigates to checkout
    Then User is directed to "Checkout Cart" page
    Then User can see details on "Checkout Cart" page
    When User checkouts products
    Then User is directed to "Checkout Information" page
    When User inputs user information
      | firstname | fname_test1 |
      | lastname  | lname_test  |
      | zipcode   |        3000 |
    Then User is directed to "Checkout Overview" page
    Then User can see details on "Checkout Overview" page
    When User completes the purchase
    Then User is directed to "Checkout Complete" page
    When User backs to Home Page
    When User logs out
    Then User is directed to "Login" page
