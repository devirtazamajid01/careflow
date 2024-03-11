require "test_helper"

class Api::ClientsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_clients_index_url
    assert_response :success
  end
end
