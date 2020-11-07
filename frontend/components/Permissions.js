import React,{Component} from 'react';
import {Query,Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from "./styles/SickButton";


const possiblePermissions=[
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]

const UPDATE_PERMISSIONS_MUTATION=gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions:[Permission],$userId:ID!){
    updatePermissions(permissions:$permissions,userId:$userId){
      id
      permissions
      name
      email
    }
  }
`


const ALL_USERS_QUERY=gql`
  query ALL_USERS_QUERY{
    users{
      id
      name
      email
      permissions
    }
  }
`

function Permissions(props) {
  return (
    <Query query={ALL_USERS_QUERY}>
      {
        ({data,loading,error})=>{
          return (
            <>
              <Error error={error}/>
              <div>
                <h2>Manage Permissions</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      {
                        possiblePermissions.map(permission =>{
                          return (
                            <th key={permission}>{permission}</th>
                          )
                        })
                      }
                      <th> ⬇⬇⬇</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.users.map(user =>{
                      return (
                        <UsersPermissions key={user} user={user}/>
                      )
                    })
                  }
                  </tbody>
                </Table>
              </div>
            </>
          )
        }
      }
    </Query>
  );
}

//--- UserPermissions component to build up each row in table and manage the state of the checkbox locally. user prop is passed down from Permissions component

class UsersPermissions extends Component {

  static propTypes = {
    user:PropTypes.shape({                                     //reshaping the user prop
      name:PropTypes.string,
      email:PropTypes.string,
      id:PropTypes.string,
      permissions:PropTypes.array,                                    //["ADMIN","USER",..]
    }).isRequired
  }

  state={
    permissions:this.props.user.permissions                           //user prop is get from Permissions component
  }

  handlePermissionChange=(e)=>{
    const checkbox=e.target
    let updatedPermissions=[...this.state.permissions]                //mutate to update the state whenever new permission is checked
    if(checkbox.checked){                                             //check that item is checked or un-checked
      updatedPermissions.push(checkbox.value)                         //add the item into updated permissions array
    }else{
      updatedPermissions=updatedPermissions.filter(                   //remove the permission if checkbox is unchecked
        permission =>permission!==checkbox.value
      )
    }
    this.setState({permissions:updatedPermissions})           //to update the UI of the checkbox with the new value of the updated permission
  }

  render() {
    const user=this.props.user

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions:this.state.permissions,
          userId:this.props.user.id
        }}
      >
        {
          (updatePermissions,{loading,error})=>{
            return(
              <>
                {
                  error && (
                    <tr>
                      <td colSpan="8">
                        <Error error={error}/>
                      </td>
                    </tr>
                  )
                }
                <tr>
                  <th>{user.name}</th>
                  <th>{user.email}</th>
                  {
                    possiblePermissions.map(permission =>{
                      return (
                        <th key={permission}>
                          <label htmlFor={`${user.id}-permission-${permission}`}>
                            <input
                              id={`${user.id}-permission-${permission}`}
                              type="checkbox"
                              checked={this.state.permissions.includes(permission)}
                              value={permission}
                              onChange={this.handlePermissionChange}
                            />
                          </label>
                        </th>
                      )
                    })
                  }
                  <th>
                    <SickButton
                      type="button"
                      disabled={loading}
                      onClick={updatePermissions}
                    >
                      Updat{loading?"ing":"e"}
                    </SickButton>
                  </th>
                </tr>
              </>
            )
          }
        }
      </Mutation>
    );
  }
}

export default Permissions;

