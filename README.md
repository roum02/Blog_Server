# 📚 Blog Backend Database Schema

- AWS 과금 문제로 ec2 및 RDS 재생성.. 이 시간이 좀 걸렸음 ^~^..
- Docker 배포 + (Jenkins 자동배포)
- (추가) Nginx

## 📝 Post Table

| Column      | Type         | Description                    |
| ----------- | ------------ | ------------------------------ |
| id          | PK, int      | 게시글 ID (Primary Key)        |
| title       | string       | 게시글 제목                    |
| content     | text         | 게시글 본문 (이미지 포함 가능) |
| category    | string or FK | 카테고리 이름 또는 ID          |
| authorId    | FK (User)    | 작성자 ID                      |
| viewCount   | int          | 조회수                         |
| isPublished | boolean      | 게시글 공개 여부               |
| createdAt   | datetime     | 작성일                         |
| updatedAt   | datetime     | 수정일                         |

---

## 🏷️ Category Table

| Column      | Type    | Description          |
| ----------- | ------- | -------------------- |
| id          | PK, int | 카테고리 ID          |
| name        | string  | 카테고리 이름        |
| description | string  | 카테고리 설명 (선택) |

---

## 💬 Comment Table (Optional)

| Column     | Type         | Description                |
| ---------- | ------------ | -------------------------- |
| id         | PK, int      | 댓글 ID (Primary Key)      |
| postId     | FK (Post)    | 해당 댓글이 속한 게시글 ID |
| authorName | string       | 작성자 이름 또는 닉네임    |
| content    | text         | 댓글 내용                  |
| parentId   | FK (Comment) | 대댓글일 경우 부모 댓글 ID |
| createdAt  | datetime     | 작성일                     |

---

## 👤 User Table (Optional)

| Column    | Type     | Description              |
| --------- | -------- | ------------------------ |
| id        | PK, int  | 사용자 ID                |
| username  | string   | 로그인용 사용자 이름     |
| password  | string   | 해시된 비밀번호          |
| nickname  | string   | 닉네임                   |
| email     | string   | 이메일 주소              |
| role      | enum     | 사용자 역할 (admin/user) |
| createdAt | datetime | 가입일                   |

# 카카오톡 로그인 프로세스

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FHyxHr%2FbtsHt56KTK3%2FHE4mSk5INdL33tH73eTIj0%2Fimg.png)
