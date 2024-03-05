'use client';
import { Role, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Select, Spinner, Table, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AddEditMasterDataModal = ({
  addedListId,
  outletId
}: {
  outletId: Number
  addedListId: string[]
}) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [totalRow, setTotalRow] = useState(0)
  const [roleId, setRoleId] = useState("0");
  const [queryString, setQueryString] = useState("")
  const [users, setSubAccount] = useState<User[]>([])
  const limit = 10
  const disabled = false
  const modalTitle = "Pilih User untuk ditambahkan"
  const buttonTitle = "Tambah Pengguna Outlet"

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["users", queryString],
    queryFn: () => fetch(`/api/users${queryString ? queryString : ''}`).then(res=>res.json())
  })

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetch(`/api/roles`).then(res=>res.json())
  })

  useEffect(() => {
    console.log(userResponse)
    if(userResponse){
      const [list, count] = userResponse
      setSubAccount(list)
      setTotalRow(count)

    }
  }, [userResponse])

  useEffect(() => {
    if(page === 1) {
      setQueryString(`?search=${search}&page=${page}&limit=${limit}`)
    } else {
      setPage(1)
    }
  }, [search])

  useEffect(() => {
    setQueryString(`?search=${search}&page=${page}&limit=${limit}`)
  }, [page])

  const handleAdd = async (user: User) => {
    const body = {
      userId: user.id,
      roleId: roleId
    }

    const res = await fetch(`/api/outlets/${outletId}/users`, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    router.refresh()
    setOpen(false)

  }

  return (
    <>
      <Button color="purple" onClick={() => setOpen(true)} disabled={disabled}>{buttonTitle}</Button>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Body className="py-10 overflow-auto">
            <div>
              {/* <div className="mb-10 flex justify-start items-center gap-2">
                <div>Cari Nama:</div>
                <div>
                  <TextInput className="w-100" name="search" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}/>
                </div>
              </div> */}
              <div className="mb-5 flex justify-start items-center gap-2">
                <div>Pilih Role :</div>
                <div>
                  {isLoadingRoles && <Spinner className="m-auto" aria-label="Loading" />}
                  {!isLoadingRoles && <Select value={roleId} name="roleId" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleId(e.target.value)}>
                      <option value='0'>Pilih Role</option>
                      {roles && roles.map((role: Role) => <option key={role.id} value={String(role.id)}>{role.name}</option>)}
                    </Select>}
                </div>
              </div>
              <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-[1px] border-slate-200">
                    <Table.HeadCell>No.</Table.HeadCell>
                    <Table.HeadCell>Nama</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                    <Table.HeadCell>Aksi</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {users && users.map((user, index) => (<Table.Row key={index}>
                        <Table.Cell>{(index+1) + (limit * (page-1))}</Table.Cell>
                        <Table.Cell>{user.name}</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell className="text-center">
                          <Button disabled={addedListId.indexOf(user.id) >= 0 } color="purple" onClick={() => handleAdd(user)}>
                              Tambahkan
                            </Button>
                        </Table.Cell>
                      </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div>

            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button color="gray" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddEditMasterDataModal