import React, { useState } from 'react';
import axios from 'axios';
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters long').required('Name is required')
})


const Form = (props) => {

  const [order, setOrder] = useState();

  const [ form, setForm ] = useState({ 
    name: '',
    size: '14',
    sauce: 'marinara',
    toppings: {
      pepperoni: false,
      sausage: false,
      peppers: false,
      olives: false
    },
    instructions: ''
   });

   const [ errors, setErrors ] = useState({
     name: ''
   });

   

   const validate = (e) => {
    yup
      .reach(schema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ''
        })
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors
        })
      })
   }

   const handleChange = (e) => {
    e.persist();
    if(e.target.type === "checkbox") {
      setForm({
        ...form,
        toppings: {
          ...form.toppings,
          [e.target.name]: e.target.checked
        }
      })
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      })
    }
     if (e.target.name === 'name') validate(e);
   }

   const submitForm = (e) => {
    e.preventDefault();

    const processedForm = {
      ...form,
      toppings: Object.keys(form.toppings).filter(topping => form.toppings[topping])
    }

     axios
       .post('https://reqres.in/api/orders', processedForm)
       .then(res => {
         console.log(res.data);
         setOrder(res.data);
         setForm({
           name: '',
           size: '14',
           sauce: 'marinara',
           toppings: {
             pepperoni: false,
             sausage: false,
             peppers: false,
             olives: false
           },
           instructions: ''
         });
       })
   }

  return (
    <form onSubmit={submitForm}>
      <label>
        Name for Order
        <input 
          name="name"
          value={form.name}
          onChange={handleChange}
         />
      </label>
      {errors.name && <p className="err">{errors.name}</p>}
      <div className="dropdowns">
        <label>
          Size:
        <select
            name="size"
            value={form.size}
            onChange={handleChange}
            data-cy="size"
          >
            <option value="14">14"</option>
            <option value="16">16"</option>
            <option value="18" >18"</option>
          </select>
        </label>

        <label>
          Sauce:
        <select
            name="sauce"
            value={form.sauce}
            onChange={handleChange}
            data-cy="sauce"
          >
            <option value="marinara">Marinara</option>
            <option value="alfredo">Alfredo</option>
            <option value="ranch" >Ranch</option>
          </select>
        </label>
      </div>

      <div className="checklist">
        <label>
        <input
            name="pepperoni"
            type="checkbox"
            checked={form.toppings.pepperoni}
            onChange={handleChange}
          />
          Pepperoni
        </label>
        <label>
        <input
            name="sausage"
            type="checkbox"
            checked={form.toppings.sausage}
            onChange={handleChange}
          />
          Sausage
        </label>
        <label>
        <input
            name="peppers"
            type="checkbox"
            checked={form.toppings.peppers}
            onChange={handleChange}
          />
          Peppers
        </label>
        <label>
        <input
            name="olives"
            type="checkbox"
            checked={form.toppings.olives}
            onChange={handleChange}
          />
          Olives
        </label>
      </div>

      <label>
        Special Instructions
        <input
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
        />
      </label>
      <button data-cy="submit">Order Pizza!</button>

      {order && <pre data-cy="order" >{JSON.stringify(order, null, 2)}</pre>}
    </form>
  );
}

export default Form;