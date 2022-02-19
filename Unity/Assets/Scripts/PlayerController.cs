using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 4;
    public float jumpSpeed = 3;
    public float sens = 20;
    private float x = 0;
    private float z = 0;
    private float rotSpeed = 80;
    private float rotSpeedY = 40;
    private float rotX = 0;
    private float rotY = 0;
    public float gravity = -14;
    private Vector3 velocity;
    private bool isGrounded;

    private Vector3 moveDir = Vector3.zero;

    private CharacterController controller;
    private GameObject cam;
    //Animator anim;

    // Start is called before the first frame update
    void Start()
    {
        Cursor.visible = false;
        Cursor.lockState = CursorLockMode.Locked;
        controller = GetComponent<CharacterController>();
        cam = GetComponentInChildren<Camera>().gameObject;
        //anim = GetComponent<Animator>();
        sens /= 4;
    }

    // Update is called once per frame
    void Update()
    {
        // isGrounded = Physics.Check
        if (controller.isGrounded)
        {
            velocity.y = 0f;
            /*if (anim.GetBool("running") == false && anim.GetBool("attacking") == false)
            {
                anim.SetInteger("condition", 0);
            }*/
        }
        /*if (!anim.GetBool("attacking") && controller.isGrounded && (x > 0.001f || x < -0.001f || z > 0.001f || z < -0.001f))
        {
            anim.SetBool("running", true);
            anim.SetInteger("condition", 1);
        }
        else if (!anim.GetBool("attacking") && controller.isGrounded && !(x > 0.001f || x < -0.001f || z > 0.001f || z < -0.001f))
        {
            anim.SetBool("running", false);
            anim.SetInteger("condition", 0);
        }*/
        Vector2 mouseDelta = new Vector2(Input.GetAxis("Mouse X"), Input.GetAxis("Mouse Y"));
        rotY -= mouseDelta.y * sens;
        rotY = Mathf.Clamp(rotY, -90f, 90f);
        cam.transform.localEulerAngles = Vector3.right * rotY;
        transform.Rotate(Vector3.up * mouseDelta.x * sens);
        Movement();
    }

    void Movement()
    {
        Vector3 move;
        x = Input.GetAxis("Vertical");
        z = Input.GetAxis("Horizontal");
        move = transform.right * z + transform.forward * x;

        if (Input.GetButton("Jump") && controller.isGrounded)
        {
            //anim.SetInteger("condition", 3);
            velocity.y = Mathf.Sqrt(jumpSpeed * -2 * gravity);
        }
        controller.Move(move * speed * Time.deltaTime);

        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}