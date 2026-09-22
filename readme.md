Tabel`lar

User tabel

```json
{
    first_name:string, 
    last_name:string,
    data_both:string, // tug'ilgan sana 17/07/2006
    login:string,
    password:string,
    role:enum,
}
```


Lessen tabel

```json
{
    name:string,
    description:string,
    author:string, // only teacher
    group_id:object,
    video_uri:string,
    file_uri:string,
}
```

Class_room tabel
```json
{
    name:string,
    size:number,
    group_id:group_id
}
```

------------------------- Update Backend

Course tabel
```json
{
    name:string
    price:number
    description:string
}
```
Group tabel

```json
{
    name:string,
    lessen_wach:string, //soat
    teacher:user_id, 
    student:user_id,
    lessen_day:[],
    course_id:course_id // fullstack / python / datasine / vibe-coding 
}
```

Homework tabel
```json
{
    file_name:file,
    description:string,
    student_id:user_id,
    lesson_id:lesson_id,
}
```

