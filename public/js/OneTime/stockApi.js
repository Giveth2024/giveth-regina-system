// Apis will appear here 
export async function getStock(filters = {}) {
  try {
    const params = new URLSearchParams(filters);

    const response = await fetch(`/api/giveth/stock?${params}`);
    const data = await response.json();
    if (!data.success) return alert(data.message);
    console.log(data.message);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

/*
That's because you're declaring a parameter and never using it.

```js
export async function getStock(filters = {}) {
```

Inside the function, you never reference `filters`, so ESLint correctly says:

> `'filters' is assigned a value but never used.`

---

### Right now

Your code is effectively this:

```js
export async function getStock() {
    const response = await fetch("/api/giveth/stock");
}
```

The `filters` object does nothing.

---

## Since you're planning dynamic filtering, use it to build the query string.

For example:

```js
export async function getStock(filters = {}) {
    const params = new URLSearchParams(filters);

    const response = await fetch(`/api/giveth/stock?${params}`);

    const data = await response.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    return data;
}
```

Then later you can do

```js
await getStock({
    page: 1,
    search: "sprite",
    category: "Soft Drinks",
    low_stock: true,
    sort_by: "item_name",
    order: "ASC"
});
```

which automatically becomes

```
/api/giveth/stock?page=1
&search=sprite
&category=Soft+Drinks
&low_stock=true
&sort_by=item_name
&order=ASC
```

No string concatenation needed.

---

## Even better

Since your API has lots of optional filters, build the URL like this:

```js
export async function getStock(filters = {}) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value !== "" && value !== null && value !== undefined) {
            params.append(key, value);
        }
    }

    const response = await fetch(`/api/giveth/stock?${params}`);

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
}
```

This prevents URLs like

```
?page=&category=&search=
```

and only sends values the user actually selected.

For your POS project, this is the approach I'd recommend because it scales naturally as you add search, pagination, sorting, quantity ranges, price ranges, and all the checkbox filters without having to rewrite `getStock()`.

*/