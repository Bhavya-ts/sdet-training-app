import { expect, test } from "@playwright/test";
test("create profile form", async ({ page }) => {
  await page.goto("http://localhost:3000/form");

  const formLocator = page.locator("form");

  const usernameContainer = formLocator.locator("div").filter({
    has: page.getByLabel("username"),
  });

  await expect(usernameContainer).toBeVisible();

  const usernameContainerMinCharErrorLocator = usernameContainer.getByText(
    "String must contain at least 2 character(s)"
  );

  await expect(usernameContainerMinCharErrorLocator).not.toBeVisible();

  const descriptionLocator = usernameContainer.getByText(
    "This is your public display name."
  );

  await expect(descriptionLocator).toBeVisible();

  const interestsContainer = formLocator
    .locator("div")
    .filter({
      has: page.getByRole("checkbox"),
    })
    .filter({
      has: page.getByText("Interests"),
    });

  await expect(interestsContainer).toBeVisible();

  // 1. 3 options are presented
  // 2. 3 options are what we want them to be
  // 3. Option must be selectable
  // 4. Multiple options can be selectable at the same time
  // 5. Option must be unselectable
  // 6. Clicking on the label should toggle the checkbox
  // 7. Clicking on the button should toggle the checkbox

  const LabelOptions = interestsContainer.locator("label").filter({
    hasNotText: "Interests",
  });

  await expect(LabelOptions).toHaveCount(3);

  const interestItems = ["Books", "Movies", "Music"];

  for (const interest of await LabelOptions.all()) {
    const interestText = await interest.textContent();

    expect(interestItems).toContain(interestText);
  }

  // const buttonOptions = interestsContainer.locator("button").filter({
  //   has: page.getByRole("checkbox"),
  // });

  const buttonOptions = interestsContainer
    .getByRole("checkbox")
    .and(page.locator("button"));

  await expect(buttonOptions).toHaveCount(3);

  const firstLabel = LabelOptions.first();

  await expect(firstLabel).toBeChecked();

  await firstLabel.uncheck();

  await expect(firstLabel).not.toBeChecked();

  await firstLabel.check();

  await expect(firstLabel).toBeChecked();

  const secondLabel = LabelOptions.nth(1);

  await expect(secondLabel).not.toBeChecked();

  await secondLabel.check();

  await expect(secondLabel).toBeChecked();
  await expect(firstLabel).toBeChecked();

  const lastLabel = LabelOptions.last();

  await expect(lastLabel).not.toBeChecked();

  const firstBtnOption = buttonOptions.first();

  await expect(firstBtnOption).toBeChecked();

  await firstBtnOption.click();

  await expect(firstBtnOption).not.toBeChecked();

  await firstBtnOption.click();

  await expect(firstBtnOption).toBeChecked();

  await secondLabel.uncheck();

  await expect(secondLabel).not.toBeChecked();

  for (const item of await buttonOptions.all()) {
    const isChecked = await item.isChecked();

    if (!isChecked) {
      await item.check();
    }

    await expect(item).toBeChecked();
  }

  const submitBtn = formLocator.getByRole("button", {
    name: "Submit",
  });

  await submitBtn.click();

  await expect(usernameContainerMinCharErrorLocator).toBeVisible();

  const usernameLabel = usernameContainer.getByLabel("Username");

  await expect(usernameLabel).toBeVisible();

  await usernameLabel.pressSequentially("One Piece");

  await expect(usernameLabel).toHaveValue("One Piece");

  await expect(usernameContainerMinCharErrorLocator).not.toBeVisible();


  //Day 2 Task 

  const notifyField = formLocator.locator("div").filter({
    hasText: "notify me about...",
  });
  await expect(notifyField).toBeVisible();
  

  const roleGroup = notifyField.getByRole('radiogroup');

  //The process by labels 
  const roleLabels = roleGroup.locator('label');

  expect(roleLabels).toHaveCount(3);

  const items = ['All new messages' , 'Direct messages and mentions','Nothing'];

  //checking the text content of all the labels 
  for(const label of await roleLabels.all()){
    const labelText = await label.textContent();

    expect(items).toContain(labelText);
  }

  //By default none is checked 
  for (let i = 0; i < 3; i++) {
    expect(roleLabels.nth(i)).not.toBeChecked();
    
  }
  //If i check any one then other two should be unckecked 
  for(let i = 0 ; i<3 ; i++){
    await roleLabels.nth(i).click();
    expect(roleLabels.nth(i)).toBeChecked();

    for (let j = 0; j <3; j++) {
      if(j !== i){
        expect(roleLabels.nth(j)).not.toBeChecked();
      }
    };
  }

  //the process by Button 
  const roleButtons = roleGroup.locator('button').and(page.getByRole('radio'));
  expect(roleButtons).toHaveCount(3);
  for(let i = 0 ; i<3 ; i++){
    await roleButtons.nth(i).click();
    expect(roleButtons.nth(i)).toBeChecked();

    for (let j = 0; j <3; j++) {
      if(j !== i){
        expect(roleButtons.nth(j)).not.toBeChecked();
      }
    };
  }


  //Next Div of dropedown menu 

  const countryField = formLocator.locator("div").filter({
    hasText: "Country",
  });
  await expect(countryField).toBeVisible();

  const selectionBtn = countryField.locator('button');
  const spanText = selectionBtn.locator('span');
  await expect(spanText).toHaveText('Select a verified email to display');

  const selectField = countryField.locator('select');
  await expect(selectField).toBeVisible();

  //check at start options should not be visible 
  const optionListField = selectField.locator('option');
  await expect(optionListField).toHaveCount(3);
  

  selectField.selectOption({label:'India'});
  await expect(spanText).toHaveText('India');
  await expect(selectField).toHaveValue(await selectField.inputValue()) // returns the value of select after the input of otion 

  selectField.selectOption({label:'USA'});
  await expect(spanText).toHaveText('USA');
  await expect(selectField).toHaveValue(await selectField.inputValue())

  selectField.selectOption({label:'UK'});
  await expect(spanText).toHaveText('UK');
  await expect(selectField).toHaveValue(await selectField.inputValue()) 

  
  


});
